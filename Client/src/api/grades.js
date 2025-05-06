import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Fetch grades for the current student
export const fetchGrades = async () => {
  const res = await axiosInstance.get("/api/grades");
  return res.data;
};

// Post a grade for a student (Lecturer only)
export const postGrade = async (gradeData) => {
  const res = await axiosInstance.post("/api/grades", gradeData);
  return res.data;
};

// Delete a grade (Lecturer only)
export const deleteGrade = async (gradeId) => {
  const res = await axiosInstance.delete("/api/grades", {
    data: { grade_id: gradeId },
  });
  return res.data;
};