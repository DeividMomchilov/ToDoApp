using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Data;
using ToDoApp.Models;

namespace ToDoApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToDoController : Controller
    {
        private readonly ApplicationDbContext _dbContext;

        public ToDoController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var todos = await _dbContext
                .ToDoItems
                .OrderBy(t => t.Position)
                .ToListAsync();

            return Ok(todos);
        }

        [HttpPut]
        public async Task<IActionResult> CreateTask(ToDoItem task)
        {
            task.UserId = "1323";

            _dbContext.ToDoItems.Add(task);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, task);
        }
    }
}
