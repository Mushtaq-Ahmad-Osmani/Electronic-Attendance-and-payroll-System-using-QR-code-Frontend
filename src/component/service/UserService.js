import axios from "axios";
import FileDownload from "js-file-download";

class UserService{
    static BASE_URL = "http://localhost:8080"
    static async login (email ,password){
        try{
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {email,password})
            return response.data;
        } catch(err){
            throw err;
        }
    }

  
 static async register(formData, token) {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        let errorMessage = 'Registration failed.';
        let statusCode = response.status;
        let data;

        
        const responseText = await response.text();

        try {
            
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Invalid JSON response:', jsonError, 'Raw response:', responseText);
            errorMessage = 'Server returned an invalid response. Please try again later.';
            throw new Error(errorMessage);
        }

        if (!response.ok) {
            errorMessage = data.error || `Registration failed (status: ${statusCode}).`;
            throw new Error(errorMessage);
        }

        return {
            statusCode: response.status,
            message: data.message || 'User registered successfully.',
            error: data.error
        };
    } catch (error) {
        console.error('Error in UserService.register:', error.message);
        throw error;
    }
}

    
    static async getAllUsers (token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`,
                {
                    headers: {Authorization:`Bearer ${token}`}
                } )
            return response.data;
        } catch(err){
            throw err;
        }
    }

    
    static async getYourProfile (token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`,
                {
                    headers: {Authorization:`Bearer ${token}`}
                } )
            return response.data;
        } catch(err){
            throw err;
        }
    }
    
    static async uploadProfilePicture(file, teacherId, token) {
        try {
            const formData = new FormData();
            formData.append("file", file);
             
    
            const response = await axios.post(`${UserService.BASE_URL}/upload-profile-picture/${teacherId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
    
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getProfilePicture(teacherId, token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/profile-picture/${teacherId}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob" 
        });
        return URL.createObjectURL(response.data); 
    } catch (err) {
        throw err;
    }
}
    
    static async getUserById(userId,token){
        try{
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`,
                {
                    headers: {Authorization:`Bearer ${token}`}
                } )
            return response.data;
        } catch(err){
            throw err;
        }
    }
    
    
    static async deleteUser (userId,token){
        try{
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`,
                {
                    headers: {Authorization:`Bearer ${token}`}
                } )
            return response.data;
        } catch(err){
            throw err;
        }
    }

    static async updateUser (userId,userData,token){
        try{
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData,
                {
                    headers: {Authorization:`Bearer ${token}`}
                } )
            return response.data;
        } catch(err){
            throw err;
        }
    }

    static async updateUserPassword(passwordData, token) {
        try {
            const response = await axios.put(`${UserService.BASE_URL}/user/update-password`, passwordData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

 static async createNotification(data, token) {
        try {
            const response = await axios.post(
                `${UserService.BASE_URL}/api/notifications/admin/create`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async getAllNotifications(token) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/api/notifications/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async deleteNotification(id, token) {
        const res = await axios.delete(
            `${UserService.BASE_URL}/api/notifications/admin/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    }

static async getPayrollByTeacherId(teacherId, year, month, token) {
  try {
    const response = await axios.get(`${UserService.BASE_URL}/payroll/admin/teacher/${teacherId}`, {
      params: { year, month },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}


static async exportPayrollExcelByTeacherId(teacherId, year, month, token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/payroll/export/admin/excel-teacher`, {
        params: { teacherId, year, month },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      FileDownload(response.data, `teacher-${teacherId}-payroll-${year}-${month}.xlsx`);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error exporting to Excel');
    }
  }

static async exportPayrollCsvByTeacherId(teacherId, year, month, token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/payroll/export/admin/csv-teacher`, {
        params: { teacherId, year, month },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      FileDownload(response.data, `teacher-${teacherId}-payroll-${year}-${month}.csv`);
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error exporting to CSV');
    }
  }

    // Just MyPayroll
static async getMyPayroll(token ,year,month) {
    try {
        console.log(token); //Debug
        const response = await axios.get(`${UserService.BASE_URL}/payroll/my`, {
            params: { year, month },
            headers: { Authorization: `Bearer ${token}` }
            
            
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

// List of all payrolls just for admin
static async getAllPayrolls(token, year, month) {
        try {
            console.log("Sending request to /payroll/admin/all with params:", { year, month }); 
            const response = await axios.get(`${UserService.BASE_URL}/payroll/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) }
            });
            return response.data;
        } catch (err) {
            console.error("Error in getAllPayrolls:", err);
            throw new Error(err.response?.data?.message || 'Error fetching payrolls');
        }
    }

static async exportAllPayrollExcel(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/payroll/export/admin/excel`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) },
                responseType: "blob"
            });
            FileDownload(response.data, `all-payroll-${year}-${month}.xlsx`);
        } catch (err) {
            console.error("Error in exportAllPayrollExcel:", err);
            throw new Error(err.response?.data?.message || 'Error exporting to Excel');
        }
    }

    static async exportAllPayrollCSV(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/payroll/export/admin/csv`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) },
                responseType: "blob"
            });
            FileDownload(response.data, `all-payroll-${year}-${month}.csv`);
        } catch (err) {
            console.error("Error in exportAllPayrollCSV:", err);
            throw new Error(err.response?.data?.message || 'Error exporting to CSV');
        }
    }

 static async exportMyPayrollExcel(token, year, month) {
  try {
    const response = await axios.get(`${UserService.BASE_URL}/payroll/export/excel`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { year, month },
      responseType: "blob",
    });
    FileDownload(response.data, `my-payroll-${year}-${month}.xlsx`);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error exporting to Excel');
  }
}

static async exportMyPayrollCSV(token, year, month) {
  try {
    const response = await axios.get(`${UserService.BASE_URL}/payroll/export/csv`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { year, month },
      responseType: "blob",
    });
    FileDownload(response.data, `my-payroll-${year}-${month}.csv`);
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error exporting to CSV');
  }
}

 static async getMyAttendances(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/attendance/my`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year, month }
            });
            return { data: response.data, error: null };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error fetching attendance';
            return { data: [], error: errorMessage };
        }
    }

 static async getAllAttendances(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/attendance/admin/all`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) }
            });
            return { data: response.data, error: null };
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error fetching attendances';
            return { data: [], error: errorMessage };
        }
    }

    // export (MY) attendance 
   static async exportMyAttendanceExcel(token, year, month) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/attendance/export/excel`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month },
            responseType: "blob"
        });
        FileDownload(response.data, `my-attendance-${year}-${month}.xlsx`);
    } catch (err) {
        throw new Error(err.response?.data?.message || 'No Attendance records found for this year and month to exporting to Excel');
    }
}

static async exportMyAttendanceCSV(token, year, month) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/attendance/export/csv`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year, month },
            responseType: "blob"
        });
        FileDownload(response.data, `my-attendance-${year}-${month}.csv`);
    } catch (err) {
        throw new Error(err.response?.data?.message || 'No Attendance records found for this year and month to exporting to CSV');
    }
}

    // export (ALL) attendance for admin 
   static async exportAllAttendanceCSV(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/attendance/export/admin/csv`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) },
                responseType: "blob"
            });
            FileDownload(response.data, `all-attendance-${year}-${month}.csv`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'No Attendance records found for this year and month to exporting to CSV';
            throw new Error(errorMessage);
        }
    }

static async exportAllAttendanceExcel(token, year, month) {
        try {
            const response = await axios.get(`${UserService.BASE_URL}/attendance/export/admin/excel`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: Number(year), month: Number(month) },
                responseType: "blob"
            });
            FileDownload(response.data, `all-attendance-${year}-${month}.xlsx`);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'No Attendance records found for this year and month to exporting to Excel';
            throw new Error(errorMessage);
        }
    }

static async getAttendancesByEmail(email, token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/attendance/admin/email/${email}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}

 static async getAttendancesByTeacherId(teacherId, token, year, month) {
  try {
    const response = await axios.get(`${UserService.BASE_URL}/attendance/admin/teacher/${teacherId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { year, month }
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}

 

 static async exportTeacherAttendanceExcel(teacherId, token, year, month) {
  try {
    const response = await axios.get(
      `${UserService.BASE_URL}/attendance/export/admin/teacher/${teacherId}/excel`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        params: { year, month }
      }
    );
    FileDownload(response.data, `teacher-${teacherId}-attendance-${year}-${month}.xlsx`);
  } catch (err) {
    throw err;
  }
}

static async exportTeacherAttendanceCSV(teacherId, token, year, month) {
  try {
    const response = await axios.get(
      `${UserService.BASE_URL}/attendance/export/admin/teacher/${teacherId}/csv`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        params: { year, month }
      }
    );
    FileDownload(response.data, `teacher-${teacherId}-attendance-${year}-${month}.csv`);
  } catch (err) {
    throw err;
  }
}


static async getAllSchedules(token) {
    try {
      console.log('Fetching all schedules with token:', token);
      const response = await axios.get(`${UserService.BASE_URL}/schedules/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Schedules response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching schedules:', err.response ? err.response.data : err.message);
      throw err;
    }
  }

  static async getScheduleById(id, token) {
    try {
      console.log('Fetching schedule with id:', id, 'token:', token);
      const response = await axios.get(`${UserService.BASE_URL}/schedules/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Schedule response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching schedule:', err.response ? err.response.data : err.message);
      throw err;
    }
  }

  static async createSchedule(scheduleData, token) {
    try {
      console.log('Creating schedule with data:', scheduleData, 'token:', token);
      const response = await axios.post(`${UserService.BASE_URL}/schedules/admin/add`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Create schedule response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating schedule:', err.response ? err.response.data : err.message);
      throw err.response ? new Error(err.response.data.error || err.response.data || 'Failed to create schedule') : new Error(err.message);
    }
  }

  static async updateSchedule(id, scheduleData, token) {
    try {
      console.log('Updating schedule with id:', id, 'data:', scheduleData, 'token:', token);
      const response = await axios.put(`${UserService.BASE_URL}/schedules/admin/updateSchedule/${id}`, scheduleData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Update schedule response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating schedule:', err.response ? err.response.data : err.message);
      throw err.response ? new Error(err.response.data.error || err.response.data || 'Failed to update schedule') : new Error(err.message);
    }
  }

  static async deleteSchedule(id, token) {
    try {
      console.log('Deleting schedule with id:', id, 'token:', token);
      const response = await axios.delete(`${UserService.BASE_URL}/schedules/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Delete schedule response:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error deleting schedule:', err.response ? err.response.data : err.message);
      throw err.response ? new Error(err.response.data.error || err.response.data || 'Failed to delete schedule') : new Error(err.message);
    }
  }








    /** AUTHENTICATION CHECKER */
    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')

    }
    static isAuthenticated(){
      const token = localStorage.getItem('token')
        return !!token

    }

    static isAdmin(){
        const role = localStorage.getItem('role')
          return role === 'ADMIN'
      }

      
    static isUser(){
        const role = localStorage.getItem('role')
          return role === 'USER'
      }
      static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
      }
      
}

export default UserService;
