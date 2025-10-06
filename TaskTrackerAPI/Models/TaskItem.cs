// Declare the TaskItem fields
using System.ComponentModel.DataAnnotations;

namespace TaskTrackerAPI.Models {
    public class TaskItem {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public bool IsComplete { get; set; }
        public DateTime? DueDate { get; set; }
    }
}