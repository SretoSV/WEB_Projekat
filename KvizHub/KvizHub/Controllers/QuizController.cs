using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/Quiz")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] QuizDto dto)
        {
            QuizDto quizDto = await _quizService.AddQuiz(dto);

            if (quizDto == null)
            {
                return BadRequest(new { message = "Failed to add quiz." });
            }
            return Ok(quizDto);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromBody] QuizDto dto, int id)
        {
            QuizDto quizDto = await _quizService.EditQuiz(dto, id);

            if (quizDto == null)
            {
                return BadRequest(new { message = "Failed to edit quiz." });
            }
            return Ok(quizDto);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            int returnedId = await _quizService.DeleteQuiz(id);

            if (returnedId <= 0)
            {
                return BadRequest(new { message = "Failed to delete quiz." });
            }
            return Ok(returnedId);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllQuizzes()
        {
            List<QuizDto> quizzesDtos = await _quizService.GetAllQuizzes();
            if (quizzesDtos == null)
            {
                return BadRequest(new { message = "Failed to get quizzes." });
            }

            return Ok(quizzesDtos);
        }

    }
}
