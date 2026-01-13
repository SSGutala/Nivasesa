#!/bin/bash

# PostgreSQL Setup Script for Production
# This script helps migrate from SQLite to PostgreSQL

set -e

echo "=== PostgreSQL Setup for Nivasesa ==="
echo ""

# Check if we're using SQLite or PostgreSQL
check_current_db() {
    if grep -q 'provider = "sqlite"' prisma/schema.prisma; then
        echo "Current: SQLite (development)"
    else
        echo "Current: PostgreSQL (production)"
    fi
}

# Switch to PostgreSQL schema
switch_to_postgres() {
    echo "Switching to PostgreSQL schema..."

    # Backup current schema
    cp prisma/schema.prisma prisma/schema.sqlite.prisma.bak

    # Copy PostgreSQL schema
    cp prisma/schema.postgresql.prisma prisma/schema.prisma

    echo "Schema switched to PostgreSQL."
    echo "Make sure DATABASE_URL is set to your PostgreSQL connection string."
    echo ""
    echo "Example:"
    echo "  DATABASE_URL=\"postgresql://user:password@localhost:5432/nivasesa?schema=public\""
    echo ""
    echo "Run 'npx prisma generate' to update the Prisma client."
    echo "Run 'npx prisma db push' to create tables in PostgreSQL."
}

# Switch back to SQLite
switch_to_sqlite() {
    echo "Switching back to SQLite schema..."

    # Restore SQLite schema
    if [ -f prisma/schema.sqlite.prisma.bak ]; then
        cp prisma/schema.sqlite.prisma.bak prisma/schema.prisma
    else
        echo "No SQLite backup found. Please manually restore from version control."
        exit 1
    fi

    echo "Schema switched to SQLite."
}

# Export data from SQLite to JSON (for migration)
export_sqlite_data() {
    echo "Exporting data from SQLite..."

    # Create exports directory
    mkdir -p exports

    # Export each table (using Prisma)
    npx ts-node -e "
    const { PrismaClient } = require('@prisma/client');
    const fs = require('fs');
    const prisma = new PrismaClient();

    async function exportData() {
      const tables = ['user', 'realtorProfile', 'lead', 'transaction', 'buyerRequest', 'surveyResponse'];

      for (const table of tables) {
        try {
          const data = await prisma[table].findMany();
          fs.writeFileSync('exports/' + table + '.json', JSON.stringify(data, null, 2));
          console.log('Exported ' + table + ': ' + data.length + ' records');
        } catch (e) {
          console.log('Skipped ' + table + ': ' + e.message);
        }
      }

      await prisma.\$disconnect();
    }

    exportData();
    "

    echo "Data exported to exports/ directory."
}

# Print usage
usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  status     Check current database provider"
    echo "  postgres   Switch to PostgreSQL schema"
    echo "  sqlite     Switch back to SQLite schema"
    echo "  export     Export SQLite data to JSON files"
    echo ""
}

# Main
case "${1:-}" in
    status)
        check_current_db
        ;;
    postgres)
        switch_to_postgres
        ;;
    sqlite)
        switch_to_sqlite
        ;;
    export)
        export_sqlite_data
        ;;
    *)
        usage
        ;;
esac
