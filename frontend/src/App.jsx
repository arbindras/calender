import './App.css'
import { useState } from 'react'
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
// import DateTimePicker from "react-datetime-picker";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function App() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  if (isLoading) {
    return <></>;
  }
  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      redirectTo: 'https://calender-gules.vercel.app',
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
      },
    };
    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token, // Access token for google
          },
          body: JSON.stringify(event),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(data); alert("Event created, check your Google Calendar!");
      } else {
        console.error("Error creating event:", data);
        alert("Event creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Fetch error:", error)
      alert("An error occurred while creating the event. Please try again.");
    }
  }
  console.log(session);
  console.log(start);
  console.log(eventName);
  console.log(eventDescription);
  return (
    <div className="App">
      <div style={{ width: "400px", margin: "30px auto" }}>
        {session ? (
          <>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ textAlign: 'center', color: '#333' }}>Hey there, {session.user.email}</h2>
              <p style={{ textAlign: 'center', color: '#777' }}>Create your event below</p>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <label style={{ fontWeight: 'bold' }}>Start of your event</label>
                <DatePicker
                  selected={start}
                  onChange={(date) => setStart(date)}
                  value={start}
                  showTimeSelect
                  dateFormat="Pp"
                  timeFormat="HH:mm"
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>End of your event</label>
                <DatePicker
                  selected={end}
                  onChange={(date) => setEnd(date)}
                  value={end}
                  showTimeSelect
                  dateFormat="Pp"
                  timeFormat="HH:mm"
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>Event Name</label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  onChange={(e) => setEventName(e.target.value)}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label style={{ fontWeight: 'bold' }}>Event Description</label>
                <textarea
                  placeholder="Enter event description"
                  onChange={(e) => setEventDescription(e.target.value)}
                  style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                  <button
                    onClick={() => createCalendarEvent()}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Create Calendar Event
                  </button>

                  <button
                    onClick={() => signOut()}
                    style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Sign Out
                  </button>
                </div>

              </form>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App
