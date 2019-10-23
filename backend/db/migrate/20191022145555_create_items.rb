class CreateItems < ActiveRecord::Migration[6.0]
  def change
    create_table :items do |t|
      t.string :content
      t.references :checklist, foreign_key: true

      t.timestamps
    end
  end
end
