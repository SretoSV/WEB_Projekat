namespace KvizHub.DTO
{
    public class OnlineUserAnswerDto
    {
        public int Id { get; set; }
        public int QuizId { get; set; }
        public int ResultId { get; set; }
        public int QuestionId { get; set; }
        public int UserId { get; set; }
        public bool IsTrue { get; set; }
        public DateTime WhenChecked { get; set; }

        public ICollection<UserAnswerOptionDto> UserAnswerOptions { get; set; }
    }
}
