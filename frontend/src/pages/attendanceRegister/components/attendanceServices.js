export const registerAttendance = async (labId, user) => {
    try {
      const response = await fetch(`https://localhost:5000/attendance/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ lab_id: labId, user_id: user.user_id }),
      });
      if (!response.ok) throw new Error('Failed to register attendance');
      alert('Attendance registered successfully');
    } catch (error) {
      console.error('Error registering attendance:', error);
    }
};
  
export const endAttendance = async (labId, user) => {
    try {
      const response = await fetch(`https://localhost:5000/attendance/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ lab_id: labId, user_id: user.user_id }),
      });
      if (!response.ok) throw new Error('Failed to end attendance');
      alert('Attendance ended successfully');
    } catch (error) {
      console.error('Error ending attendance:', error);
    }
};