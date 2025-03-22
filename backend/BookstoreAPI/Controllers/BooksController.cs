using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Models;

namespace BookstoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            // Calculate the number of books to skip
            var totalBooks = await _context.Books.CountAsync();
            var books = await _context.Books
                .Skip((page - 1) * pageSize)   // Skip the books based on the current page and page size
                .Take(pageSize)                // Take the number of books specified by page size
                .ToListAsync();

            // Return paginated result with total count for client-side pagination
            return Ok(new { books, totalBooks });
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }
    }
}
