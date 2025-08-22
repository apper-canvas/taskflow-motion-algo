import categoryData from "@/services/mockData/categories.json"

class CategoryService {
  constructor() {
    this.categories = [...categoryData]
  }

  async delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.categories]
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(c => c.Id === parseInt(id))
    if (!category) {
      throw new Error("Category not found")
    }
    return { ...category }
  }

  async create(categoryData) {
    await this.delay()
    const newId = Math.max(...this.categories.map(c => c.Id), 0) + 1
    const newCategory = {
      Id: newId,
      ...categoryData,
      isCustom: true
    }
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, categoryData) {
    await this.delay()
    const categoryIndex = this.categories.findIndex(c => c.Id === parseInt(id))
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }
    
    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...categoryData
    }
    return { ...this.categories[categoryIndex] }
  }

  async delete(id) {
    await this.delay()
    const categoryIndex = this.categories.findIndex(c => c.Id === parseInt(id))
    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }
    
    const category = this.categories[categoryIndex]
    if (!category.isCustom) {
      throw new Error("Cannot delete default category")
    }
    
    this.categories.splice(categoryIndex, 1)
    return true
  }

  async getCustomCategories() {
    await this.delay()
    return this.categories.filter(c => c.isCustom)
  }

  async getDefaultCategories() {
    await this.delay()
    return this.categories.filter(c => !c.isCustom)
  }
}

export const categoryService = new CategoryService()