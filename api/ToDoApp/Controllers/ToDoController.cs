using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Data;
using ToDoApp.DTOs;
using ToDoApp.Models;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;
        private const string DemoUserId = "1323";

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetTasks()
        {
            var tasks = await _dbContext
                .ToDoItems
                .Where(t => t.UserId == DemoUserId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpPost]
        public async Task<ActionResult<ToDoItem>> CreateTask(ToDoItemDto dto)
        {
            var lastPosition = await _dbContext
                .ToDoItems
                .Where(t => t.UserId == DemoUserId)
                .Select(t => (int?)t.Position)
                .MaxAsync() ?? -1;

            var task = new ToDoItem
            {
                Title = dto.Title,
                IsCompleted = dto.IsCompleted,
                Position = lastPosition + 1,
                UserId = DemoUserId
            };

            _dbContext.ToDoItems.Add(task);
            await _dbContext.SaveChangesAsync();

            return Ok(task);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateTask(Guid id, ToDoItemDto dto)
        {
            var existingTask = await _dbContext
                .ToDoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DemoUserId);

            if (existingTask == null)
                return NotFound();

            existingTask.Title = dto.Title;
            existingTask.IsCompleted = dto.IsCompleted;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var existingTask = await _dbContext.ToDoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == DemoUserId);

            if (existingTask == null)
                return NotFound();

            _dbContext.ToDoItems.Remove(existingTask);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id:guid}/move-up")]
        public async Task<IActionResult> MoveUp(Guid id)
        {
            var tasks = await _dbContext
                .ToDoItems
                .Where(t => t.UserId == DemoUserId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            var index = tasks.FindIndex(t => t.Id == id);
            if (index <= 0)
                return BadRequest("Task cannot be moved up.");

            var current = tasks[index];
            var previous = tasks[index - 1];

            (current.Position, previous.Position) = (previous.Position, current.Position);

            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id:guid}/move-down")]
        public async Task<IActionResult> MoveDown(Guid id)
        {
            var tasks = await _dbContext
                .ToDoItems
                .Where(t => t.UserId == DemoUserId)
                .OrderBy(t => t.Position)
                .ToListAsync();

            var index = tasks.FindIndex(t => t.Id == id);
            if (index == -1 || index >= tasks.Count - 1)
                return BadRequest("Task cannot be moved down.");

            var current = tasks[index];
            var next = tasks[index + 1];

            (current.Position, next.Position) = (next.Position, current.Position);

            await _dbContext.SaveChangesAsync();
            return NoContent();
        }
    }
}