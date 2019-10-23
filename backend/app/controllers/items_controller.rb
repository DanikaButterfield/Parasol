class ItemsController < ApplicationController
  def index
    @items = Item.all

    render json: @items
  end

  def create
    @item = Item.create({
      content: params[:content],
      checklist_id: params[:checklist_id]
    })
  end
  
  def show
    @item = Item.find(params[:id])

    render json: @item
  end

  def destroy
    Item.destroy(params[:id])
  end
end
