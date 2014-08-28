server 'dev.applyance.com',
  user: 'deploy',
  roles: %w{web app db},
  primary: true

set :stage, :development
