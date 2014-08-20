namespace :deploy do
  desc 'Commands for thin application'
  %w(start stop restart).each do |command|
    task command.to_sym do
      on roles(:app), in: :sequence, wait: 5 do
        "thin #{command}"
      end
    end
  end
end