module.exports = {
  apps: [{
    name: 'landing_next',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/landing_next',
    instances: 'max', // atau 1, 2, 4 sesuai CPU cores
    interpreter: 'node',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
