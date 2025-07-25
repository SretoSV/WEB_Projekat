using AutoMapper;
using KvizHub.DAO;
using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;

namespace KvizHub.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryDao _categoryDao;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryDao categoryDao, IMapper mapper)
        {
            _categoryDao = categoryDao;
            _mapper = mapper;
        }

        public async Task<List<QuizCategoryDto>> GetAllCategories()
        {
            List<QuizCategory> categories = await _categoryDao.GetAllCategoriesAsync();
            return _mapper.Map<List<QuizCategoryDto>>(categories);
        }
    }
}
