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

namespace :db do
  desc "Seed database"
  task :seed, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)
  end

  desc "Empty the database (truncate all tables)"
  task :empty, :env do |cmd, args|
    env = args[:env] || "development"
    Rake::Task['environment'].invoke(env)
    Applyance::Client.db.tables.each do |table|
      Applyance::Client.db.run("TRUNCATE TABLE #{table}") if table != "schema_info"
    end
  end

  desc "Reseed the database"
  task :reseed, [:env] => [:empty, :seed]
end
