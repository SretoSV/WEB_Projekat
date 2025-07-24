using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("/")]
        public async Task<IActionResult> Add([FromBody] QuizDto dto)
        {
            Quiz quiz = await _quizService.AddQuiz(dto);

            if (quiz == null)
            {
                return BadRequest(new { message = "Failed to add quiz." });
            }
            return Ok(quiz);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("/{id}")]
        public async Task<IActionResult> Edit(int id)
        {
            Quiz quiz = await _quizService.EditQuiz(id);

            if (quiz == null)
            {
                return BadRequest(new { message = "Failed to edit quiz." });
            }
            return Ok(quiz);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Quiz quiz = await _quizService.DeleteQuiz(id);

            if (quiz == null)
            {
                return BadRequest(new { message = "Failed to delete quiz." });
            }
            return Ok(quiz);
        }

        [Authorize]
        [HttpGet("quizzes")]
        public async Task<IActionResult> GetLastXQuizzes(int limit = 30, DateTime? before = null)
        {
            List<Quiz> quizzes = await _quizService.GetLastXQuizzes(limit, before);

            return StatusCode(200);
        }

    }
}
