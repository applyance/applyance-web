desc "Start server (via rerun)"
task :start do
  sh "rerun --dir routes,db,helpers,lib,models,config --signal KILL -- thin start --debug --port 3002 --environment development"
end
