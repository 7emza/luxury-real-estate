module.exports = {
  apps: [
    {
      name: '7emza-luxury-real-estate',
      script: 'node_modules/.bin/next',
      args: 'start -p 3030',
      cwd: '/var/www/luxury-real-estate',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
      error_file: '/var/www/luxury-real-estate/logs/pm2-error.log',
      out_file: '/var/www/luxury-real-estate/logs/pm2-out.log',
      log_file: '/var/www/luxury-real-estate/logs/pm2-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
