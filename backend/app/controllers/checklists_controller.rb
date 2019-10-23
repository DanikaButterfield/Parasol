class ChecklistsController < ApplicationController
  def index
    @checklists = Checklist.all

    render json: @checklists, include: :items
  end

  def create
    @checklist = Checklist.create({
      name: params[:name]
    })
  end

  def show
    @checklist = Checklist.find(params[:id])

    render json: @checklist, include: :items
  end

  def update
    @checklist = Checklist.find(params[:id])
    @checklist.update(name: params[:name])

    render json: @checklist
  end

  def destroy
    Checklist.destroy(params[:id])
  end
end
