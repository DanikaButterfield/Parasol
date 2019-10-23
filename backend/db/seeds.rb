# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Item.destroy_all
Checklist.destroy_all

myList = Checklist.create(name: "School Items")

parasol = Item.create(content: "Parasol", checklist_id: myList.id)
purse = Item.create(content: "Purse", checklist_id: myList.id)
laptop = Item.create(content: "Laptop bag", checklist_id: myList.id)
lunchbox = Item.create(content: "Lunchbox", checklist_id: myList.id)
waterbottle = Item.create(content: "Water bottle", checklist_id: myList.id)