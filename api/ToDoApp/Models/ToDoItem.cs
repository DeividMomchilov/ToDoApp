using System.ComponentModel.DataAnnotations;
using static ToDoApp.Common.EntityValidation;

namespace ToDoApp.Models
{
    public class ToDoItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(TitleMaxLength)]
        public string Title { get; set; } = null!;

        [Required]
        public bool IsCompleted { get; set; }

        [Required]
        public int Position { get; set; }
    }
}