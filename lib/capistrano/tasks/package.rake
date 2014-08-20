namespace :deploy do
  desc 'Commands for thin application'
  %w(start stop restart).each do |dir|
    task dir.to_sym do
      on roles(:app), in: :sequence, wait: 5 do
        system("rm -rf #{dir}")
      end
    end
  end
end