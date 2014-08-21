namespace :deploy do
  desc 'Clean, Package, and Upload Code'
	task :ship do

		# remove files we don't need on the remote server (node_modules test bower etc)
  	%w(test).each do |dir|
      on roles(:app), in: :sequence, wait: 5 do
        system("sudo rm -rf #{dir}")
      end
    end

    # package and compress everything that's left in this dir
    system("tar cfz package.tar .")

    #upload to remote server
    upload("./package.tar", "#{fetch(:deploy_to)}")

  end
end