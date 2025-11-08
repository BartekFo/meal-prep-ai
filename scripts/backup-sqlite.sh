#!/bin/bash
# SQLite Database Backup Script
# Safe backup even during concurrent writes with WAL mode

BACKUP_DIR="${BACKUP_DIR:-/var/backups/meal-prep-ai}"
DB_PATH="${DB_PATH:-/var/lib/meal-prep-ai/db.sqlite}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR"

# SQLite backup (safe even during writes with WAL mode)
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/db_backup_$TIMESTAMP.sqlite'"

if [ $? -eq 0 ]; then
	echo "✓ Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.sqlite"

	# Keep only last 7 days of backups
	find "$BACKUP_DIR" -name "db_backup_*.sqlite" -mtime +7 -delete
	echo "✓ Cleaned up backups older than 7 days"
else
	echo "✗ Backup failed for $DB_PATH"
	exit 1
fi
