import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProblemList() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/practice/")
      .then(res => setQuestions(res.data.questions));
  }, []);

  return (
    <div className="main">
      <h2>📚 Problems</h2>

      {questions.map((q) => (
        <div
          key={q.id}
          className="card"
          onClick={() => navigate("/practice", { state: q })}
        >
          <h3>{q.id}. {q.title}</h3>
          <p>{q.difficulty}</p>
        </div>
      ))}
    </div>
  );
}

export default ProblemList;