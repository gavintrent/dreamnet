const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { uploadAvatar, deleteAvatar } = require('./supabaseStorage');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

const uploadsDir = path.join(__dirname, '..', 'uploads');

const migrateAvatars = async () => {
  try {
    console.log('🚀 Starting avatar migration to Supabase...');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 No uploads directory found. Nothing to migrate.');
      return;
    }

    // Get all files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    console.log(`📁 Found ${files.length} files in uploads directory`);

    if (files.length === 0) {
      console.log('✅ No files to migrate.');
      return;
    }

    // Get all users with local avatar paths
    const result = await pool.query(
      'SELECT id, username, avatar FROM users WHERE avatar IS NOT NULL AND avatar LIKE \'/uploads/%\''
    );

    console.log(`👥 Found ${result.rows.length} users with local avatars to migrate`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of result.rows) {
      try {
        const avatarPath = user.avatar;
        const fileName = path.basename(avatarPath);
        const filePath = path.join(uploadsDir, fileName);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.log(`⚠️  File not found for user ${user.username}: ${filePath}`);
          continue;
        }

        console.log(`🔄 Migrating avatar for user: ${user.username}`);

        // Read file and create file object
        const fileBuffer = fs.readFileSync(filePath);
        const file = {
          buffer: fileBuffer,
          originalname: fileName,
          mimetype: getMimeType(fileName)
        };

        // Upload to Supabase
        const uploadResult = await uploadAvatar(file, user.id);
        
        if (uploadResult.success) {
          // Update database with new Supabase URL
          await pool.query(
            'UPDATE users SET avatar = $1 WHERE id = $2',
            [uploadResult.url, user.id]
          );

          console.log(`✅ Successfully migrated avatar for ${user.username}: ${uploadResult.url}`);
          successCount++;

          // Optionally delete local file after successful migration
          // Uncomment the next line if you want to remove local files
          // fs.unlinkSync(filePath);
          
        } else {
          console.error(`❌ Failed to upload avatar for ${user.username}: ${uploadResult.error}`);
          errorCount++;
        }

      } catch (error) {
        console.error(`❌ Error migrating avatar for user ${user.username}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`✅ Successfully migrated: ${successCount} avatars`);
    console.log(`❌ Failed migrations: ${errorCount} avatars`);
    
    if (successCount > 0) {
      console.log('\n💡 Note: Local files are still in the uploads directory.');
      console.log('   Uncomment the fs.unlinkSync line in the script to remove them.');
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await pool.end();
  }
};

const getMimeType = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAvatars();
}

module.exports = { migrateAvatars }; 