using KvizHub.DTO;
using KvizHub.Models;
using KvizHub.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KvizHub.Controllers
{
    [Route("api/quizzes")]
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
            if (await _quizService.DoesQuizTitleExist(dto.Title))
            {
                return BadRequest(new { message = "Quiz with this title already exists." });
            }

            try
            {
                QuizDto quizDto = await _quizService.AddQuiz(dto);

                if (quizDto == null)
                {
                    return StatusCode(500, new { message = "Internal server error while adding quiz." });
                }
                return StatusCode(201, quizDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Edit([FromBody] QuizDto dto, int id)
        {
            if (dto == null || id <= 0)
            {
                return BadRequest(new { message = "Invalid quiz data." });
            }

            try
            {
                QuizDto quizDto = await _quizService.EditQuiz(dto, id);

                if (quizDto == null)
                {
                    return StatusCode(500, new { message = "Internal server error while editing quiz." });
                }
                return Ok(quizDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = $"Quiz with id {id} does not exists." });
            }

            try
            {
                int returnedId = await _quizService.DeleteQuiz(id);

                if (returnedId <= 0)
                {
                    return StatusCode(500, new { message = "Internal server error while deleting quiz." });
                }
                return Ok(returnedId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllQuizzes()
        {
            try 
            {
                List<QuizDto> quizzesDtos = await _quizService.GetAllQuizzes();
                if (quizzesDtos == null)
                {
                    return StatusCode(500, new { message = "Internal server error while fetching quizzes." });
                }

                return Ok(quizzesDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("{id}/attempts")]
        public async Task<IActionResult> StartQuiz(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = $"Quiz with id {id} does not exists." });
            }
            try
            {
                UserQuizResultDto userQuizResultDto = await _quizService.StartQuiz(id);
                if (userQuizResultDto == null)
                {
                    return StatusCode(500, new { message = "Internal server error while starting quiz." });
                }
                return Ok(userQuizResultDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("attempts/{attemptId}")]
        public async Task<IActionResult> FinishQuiz(int attemptId, UserQuizResultDto userQuizResultDto)
        {
            if (userQuizResultDto == null || userQuizResultDto.QuizId <= 0)
            {
                return BadRequest(new { message = "Invalid quiz result data." });
            }

            try
            {
                var result = await _quizService.FinishQuiz(userQuizResultDto);

                if (result == null)
                {
                    return NotFound(new { message = $"Quiz attempt with ID {attemptId} not found." });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetAllUserQuizzes(string username)
        {
            try
            {
                List<QuizTitleDto> quizzesDtos = await _quizService.GetAllUserQuizzes(username);
                if (quizzesDtos == null)
                {
                    return StatusCode(500, new { message = "Internal server error while fetching quizzes." });
                }

                return Ok(quizzesDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{quizId}/{username}")]
        public async Task<IActionResult> GetAllUserResultsForQuiz(int quizId, string username)
        {
            if (quizId <= 0)
            {
                return BadRequest(new { message = $"Quiz with id {quizId} does not exists." });
            }
            try
            {
                List<UserQuizResultDto> resultsDtos = await _quizService.GetAllUserResultsForQuiz(quizId, username);
                if (resultsDtos == null)
                {
                    return StatusCode(500, new { message = "Internal server error while fetching quizzes." });
                }

                return Ok(resultsDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("results/{quizId}")]
        public async Task<IActionResult> GetAllResultsForQuiz(int quizId)
        {
            if (quizId <= 0)
            {
                return BadRequest(new { message = $"Quiz with id {quizId} does not exists." });
            }
            try
            {
                UserQuizResultAndProfileDto resultsDtos = await _quizService.GetAllResultsForQuiz(quizId);
                if (resultsDtos == null)
                {
                    return StatusCode(500, new { message = "Internal server error while fetching quizzes." });
                }

                return Ok(resultsDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", detail = ex.Message });
            }
        }
    }
}
