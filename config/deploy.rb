lock '3.2.1'

set :application, 'Applyance Web'
set :scm, :git

namespace :travis do

	desc 'Check that travis is reachable'
	task :check do
		exit 1 unless true
	end

	desc 'Package to release'
	task :create_release do
		run_locally do
			execute :mkdir, '-p', :'tmp'
			execute "tar -cz --exclude vendor --exclude .git --exclude .sass-cache --exclude node_modules --exclude public/scripts/ext --exclude tmp/#{fetch(:release_timestamp)}.tar.gz -f tmp/#{fetch(:release_timestamp)}.tar.gz ."
		end
		on release_roles :all do
			execute :mkdir, '-p', release_path
			upload! "tmp/#{fetch(:release_timestamp)}.tar.gz", "#{release_path}/#{fetch(:release_timestamp)}.tar.gz"
			execute "tar -xvf #{release_path}/#{fetch(:release_timestamp)}.tar.gz --directory #{release_path}"
			execute "rm #{release_path}/#{fetch(:release_timestamp)}.tar.gz"
		end
		run_locally do
			execute "rm -rf tmp"
		end
	end

	desc 'Determine the revision that will be deployed'
	task :set_current_revision do
		set :current_revision, "12345"
	end

end

namespace :deploy do

	desc 'Use Travis'
	task :use_travis do
		set :scm, :travis
	end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
			within current_path do
				if test("[ -f #{current_path}/tmp/pids/thin.pid ]")
					execute :bundle, :exec, "thin restart --port 3002 --environment #{fetch(:stage)} --daemonize"
			  else
					execute :bundle, :exec, "thin start --port 3002 --environment #{fetch(:stage)} --daemonize"
			  end
			end
    end
  end

	before :starting, :use_travis
	after :publishing, :restart

end
