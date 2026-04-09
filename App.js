const express = require("express");
require("./mongoose/db/mongoose");

const usersRouter = require("./routers/users");

const app = express();

app.use(express.json());
app.use(usersRouter);

const App = () => {
  const url = "http://localhost:8001/courses/";

  const [data, setData] = useState([]);
  const [rating, setRating] = useState(1);

  // GET DATA
  const handleGetData = async () => {
    try {
      const res = await axios.get(url + "get");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  // APPLY
  const handleApply = async (id) => {
    try {
      const res = await axios.post(url + "enroll/" + id);
      alert(res.message); // required for test
      handleGetData();
    } catch (err) {
      console.log(err);
    }
  };

  // RATING CHANGE
  const handleRating = (e) => {
    setRating(e.target.value);
  };

  // ADD RATING
  const handleAddRating = async (id) => {
    try {
      await axios.patch(url + "rating/" + id, {
        rating: Number(rating),
      });
      handleGetData();
    } catch (err) {
      console.log(err);
    }
  };

  // DROP
  const handleDrop = async (id) => {
    try {
      await axios.delete(url + "drop/" + id);
      handleGetData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      <header>
        <h2>ABC Learning</h2>
      </header>

      <div className="cardContainer">

        {data.map((course, index) => (
          <div className="card" key={course._id || index}>
            <ul>
              <div className="header">
                {/* REQUIRED TEST FIELDS */}
                <li data-testid="course-name">{course.courseName}</li>
                <li data-testid="course-dept">{course.courseDept}</li>
                <li data-testid="course-description">
                  {course.description}
                </li>

                {/* ALWAYS SHOW (IMPORTANT FOR TESTS) */}
                <li>
                  <select
                    data-testid="select-box"
                    name="rating"
                    onChange={handleRating}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>

                  <button
                    data-testid="add-rate"
                    onClick={() => handleAddRating(course._id)}
                  >
                    Add
                  </button>
                </li>

                {/* ALWAYS SHOW APPLY */}
                <li>
                  <button
                    data-testid="apply"
                    onClick={() => handleApply(course._id)}
                  >
                    Apply
                  </button>
                </li>

                {/* ALWAYS SHOW DROP */}
                <li>
                  <button
                    data-testid="drop"
                    onClick={() => handleDrop(course._id)}
                  >
                    Drop
                  </button>
                </li>
              </div>

              <div className="footer">
                <li>
                  {course.duration} hrs | {course.noOfRatings} Ratings (
                  {course.rating}/5)
                </li>
              </div>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;