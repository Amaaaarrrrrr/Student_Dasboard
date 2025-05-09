import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Default role
    student_profile: {
      reg_no: "",
      program: "",
      year_of_study: "",
      phone: "",
    },
    lecturer_profile: {
      staff_no: "",
      department: "",
      phone: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData) {
      setFormData({ ...formData, [name]: value });
    } else {
      const profileKey = formData.role === "student" ? "student_profile" : "lecturer_profile";
      setFormData({
        ...formData,
        [profileKey]: {
          ...formData[profileKey],
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "student",
          student_profile: {
            reg_no: "",
            program: "",
            year_of_study: "",
            phone: "",
          },
          lecturer_profile: {
            staff_no: "",
            department: "",
            phone: "",
          },
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>

        {formData.role === "student" && (
          <>
            <div>
              <label htmlFor="reg_no">Registration Number</label>
              <input
                type="text"
                id="reg_no"
                name="reg_no"
                value={formData.student_profile.reg_no}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="program">Program</label>
              <input
                type="text"
                id="program"
                name="program"
                value={formData.student_profile.program}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="year_of_study">Year of Study</label>
              <input
                type="number"
                id="year_of_study"
                name="year_of_study"
                value={formData.student_profile.year_of_study}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.student_profile.phone}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {formData.role === "lecturer" && (
          <>
            <div>
              <label htmlFor="staff_no">Staff Number</label>
              <input
                type="text"
                id="staff_no"
                name="staff_no"
                value={formData.lecturer_profile.staff_no}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.lecturer_profile.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.lecturer_profile.phone}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;