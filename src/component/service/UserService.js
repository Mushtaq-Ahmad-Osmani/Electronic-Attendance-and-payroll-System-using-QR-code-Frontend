import axios from "axios";

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

  
  static async register(userData, token) {
    try {
      console.log('Sending userData to backend:', userData); // Debug
      const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      throw err.response ? new Error(err.response.data.error || 'Registration failed') : new Error('Network error');
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
    
    static async uploadProfilePicture(file, userId, token) {
        try {
            const formData = new FormData();
            formData.append("file", file);
             
    
            const response = await axios.post(`${UserService.BASE_URL}/upload-profile-picture/${userId}`, formData, {
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

    static async getAllNotifications(token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/notification/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}


static async createNotification(data, token) {
    console.log(token); //Debug
    try {
        const response = await axios.post(
            `${UserService.BASE_URL}/notification/admin/create`,
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
static async getAllPayrolls(year, month, token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/payroll/admin/all`, {
            params: { year, month },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}


    static async getMyAttendances(token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/attendance/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        throw err;
    }
}


    static async getAllAttendances(token) {
    try {
        const response = await axios.get(`${UserService.BASE_URL}/attendance/admin/all`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
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
      console.error('Error creating schedule:', err.response ? (err.response.data.error || err.response.data) : err.message);
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
      throw err;
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
      throw err;
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
