namespace :bundler do
  task :setup do
    require 'rubygems'
    require 'bundler/setup'
  end
end

task :environment, [:env] => 'bundler:setup' do |cmd, args|
  ENV["RACK_ENV"] = args[:env] || "development"
  require "./app"
end

namespace :typeform do

  desc "Clear sync times"
  task :clear_all_sync_times, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    typeform_links = Applyance::TypeformLink.all
    typeform_links.update(:last_sync_time => nil)
  end

  desc "Clear typeform links"
  task :clear_all, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    typeform_links = Applyance::TypeformLink.all
    typeform_links.delete
  end

  desc "Create typeform link"
  task :link, [:env, :typeformable_type, :typeformable_id, :uid, :key] do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    typeform_link = Applyance::TypeformLink.find_or_create(
      :typeformable_type => args[:typeformable_type],
      :typeformable_id => args[:typeformable_id]
    )
    typeform_link.update(
      :uid => args[:uid],
      :key => args[:key]
    )
  end

  desc "Sync typeforms"
  task :sync, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)

    puts "============================="
    puts "Initiating new typeform sync."

    # Go through typeform links and sync
    Applyance::TypeformLink.all.each do |typeform_link|
      typeform_link.sync_applications
    end

  end

end
