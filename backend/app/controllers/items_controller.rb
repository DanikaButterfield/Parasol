class ItemsController < ApplicationController
  def index
    @items = Item.all

    render json: @items
  end

  def create
    # byebug
    @item = Item.create(item_params)
  end
  
  def show
    @item = Item.find(params[:id])

    render json: @item
  end

  def destroy
    Item.destroy(params[:id])
  end

  private
  def item_params
    params.require(:item).map do |i|
      i.permit(:content, :checklist_id)
    end
  end
end
