Sequel.migration do
  change do

    # Create typeform links
    create_table(:typeform_links) do
      primary_key :id

      String :typeformable_type
      Integer :typeformable_id
      String :uid
      String :key
      DateTime :last_sync_at

      DateTime :created_at
      DateTime :updated_at

      index [:typeformable_type, :typeformable_id], :unique => true
    end

  end
end
