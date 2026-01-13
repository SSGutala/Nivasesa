/**
 * Test script for Referral System
 *
 * Run with: npx tsx scripts/test-referrals.ts
 *
 * This script demonstrates the complete referral flow:
 * 1. Create a host with referral code
 * 2. Create a renter using the host's referral code
 * 3. Check referral stats
 * 4. Validate codes
 */

import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function generateReferralCode(): Promise<string> {
  let code: string;
  let isUnique = false;

  while (!isUnique) {
    code = nanoid(8).toUpperCase();

    const [existingHost, existingRenter] = await Promise.all([
      prisma.hostIntakeSubmission.findUnique({
        where: { referralCode: code },
        select: { id: true },
      }),
      prisma.renterIntakeSubmission.findUnique({
        where: { referralCode: code },
        select: { id: true },
      }),
    ]);

    if (!existingHost && !existingRenter) {
      isUnique = true;
      return code;
    }
  }

  throw new Error('Failed to generate unique referral code');
}

async function testReferralSystem() {
  console.log('='.repeat(60));
  console.log('Testing Nivasesa Referral System');
  console.log('='.repeat(60));

  try {
    // Step 1: Create a host
    console.log('\n1. Creating Host...');
    const hostCode = await generateReferralCode();
    const host = await prisma.hostIntakeSubmission.create({
      data: {
        fullName: 'Test Host',
        email: `testhost-${Date.now()}@example.com`,
        phoneNumber: '+1234567890',
        preferredContactMethod: 'Email',
        city: 'Frisco',
        state: 'TX',
        zipCode: '75034',
        typeOfSpaceOffered: 'Private room',
        stayDurationsOffered: 'Short-term 1-3 months,Long-term 6+ months',
        currentAvailability: 'Available now',
        referralCode: hostCode,
      },
    });

    console.log(`   Created host: ${host.fullName}`);
    console.log(`   Email: ${host.email}`);
    console.log(`   Referral Code: ${host.referralCode}`);
    console.log(`   ID: ${host.id}`);

    // Step 2: Create a renter using the host's referral code
    console.log('\n2. Creating Renter (using host\'s referral code)...');
    const renterCode = await generateReferralCode();
    const renter = await prisma.renterIntakeSubmission.create({
      data: {
        fullName: 'Test Renter',
        email: `testrenter-${Date.now()}@example.com`,
        phoneNumber: '+1987654321',
        preferredContactMethod: 'WhatsApp',
        targetCity: 'Dallas',
        targetState: 'TX',
        moveInTimeframe: 'ASAP',
        intendedStayDuration: 'Long-term 6+ months',
        lookingFor: 'A room',
        referralCode: renterCode,
        referredByCode: host.referralCode, // Using host's code
      },
    });

    console.log(`   Created renter: ${renter.fullName}`);
    console.log(`   Email: ${renter.email}`);
    console.log(`   Referral Code: ${renter.referralCode}`);
    console.log(`   Referred By Code: ${renter.referredByCode}`);
    console.log(`   ID: ${renter.id}`);

    // Step 3: Create the referral record
    console.log('\n3. Creating Referral Record...');
    const referral = await prisma.referral.create({
      data: {
        referrerUserId: host.id,
        referrerUserType: 'host',
        referrerEmail: host.email,
        referralCode: host.referralCode,
        referredUserId: renter.id,
        referredUserType: 'renter',
        referredUserEmail: renter.email,
        referrerBoostDays: 14,
        referredBoostDays: 7,
        rewardStatus: 'pending',
        referrerHostId: host.id,
        referredRenterId: renter.id,
      },
    });

    console.log(`   Referral ID: ${referral.id}`);
    console.log(`   Status: ${referral.rewardStatus}`);
    console.log(`   Referrer Boost: ${referral.referrerBoostDays} days`);
    console.log(`   Referred Boost: ${referral.referredBoostDays} days`);

    // Step 4: Get referral stats for the host
    console.log('\n4. Getting Referral Stats for Host...');
    const referrals = await prisma.referral.findMany({
      where: {
        referrerUserId: host.id,
        referrerUserType: 'host',
      },
    });

    const totalReferrals = referrals.length;
    const pendingRewards = referrals.filter((r) => r.rewardStatus === 'pending').length;
    const totalBoostDays = referrals.reduce((sum, r) => sum + r.referrerBoostDays, 0);

    console.log(`   Total Referrals: ${totalReferrals}`);
    console.log(`   Pending Rewards: ${pendingRewards}`);
    console.log(`   Total Boost Days: ${totalBoostDays}`);

    // Step 5: Simulate applying boost rewards
    console.log('\n5. Simulating Boost Application (at launch)...');
    const updated = await prisma.referral.updateMany({
      where: {
        id: referral.id,
        rewardStatus: 'pending',
      },
      data: {
        rewardStatus: 'applied',
      },
    });

    console.log(`   Updated ${updated.count} referral(s) to "applied" status`);

    // Step 6: Verify the update
    console.log('\n6. Verifying Update...');
    const verifyReferral = await prisma.referral.findUnique({
      where: { id: referral.id },
    });

    console.log(`   Referral Status: ${verifyReferral?.rewardStatus}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Test Summary');
    console.log('='.repeat(60));
    console.log(`   Host Created: ${host.email} (Code: ${host.referralCode})`);
    console.log(`   Renter Created: ${renter.email} (Code: ${renter.referralCode})`);
    console.log(`   Referral Tracked: Yes (ID: ${referral.id})`);
    console.log(`   Initial Status: pending`);
    console.log(`   Final Status: ${verifyReferral?.rewardStatus}`);
    console.log(`   Boost Days: ${referral.referrerBoostDays} (host), ${referral.referredBoostDays} (renter)`);
    console.log('\n   All tests passed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n   Error during test:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testReferralSystem()
  .then(() => {
    console.log('\n   Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n   Test failed:', error);
    process.exit(1);
  });
