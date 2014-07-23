set :output, 'log/cron.log'

every 1.minutes do
  rake "-f lib/tasks/typeform.rake typeform:sync"
end
