import { useState } from 'react'
import { meetings } from '../data/meetings'
import MeetingCard from '../components/MeetingCard'
import ReadinessBar from '../components/ReadinessBar'
import AdvisorLens from '../components/AdvisorLens'

export default function MissionControl() {
  const [selectedMeeting, setSelectedMeeting] = useState(meetings[0])

  return (
    <div className="missionControl">
      <section className="missionSidebar">
        <div className="sectionHeader">
          <span className="eyebrow">Heute</span>
          <h2>Deine Termine</h2>
        </div>

        <div className="meetingList">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              active={selectedMeeting.id === meeting.id}
              onClick={() => setSelectedMeeting(meeting)}
            />
          ))}
        </div>
      </section>

      <section className="missionMain">
        <div className="heroCard">
          <span className="pill">Today&apos;s Mission</span>

          <h1>{selectedMeeting.customer}</h1>

          <p>{selectedMeeting.mission}</p>

          <ReadinessBar value={selectedMeeting.readiness} />

          <div className="heroMeta">
            <div>
              <span>Uhrzeit</span>
              <strong>{selectedMeeting.time}</strong>
            </div>
            <div>
              <span>Meetingtyp</span>
              <strong>{selectedMeeting.type}</strong>
            </div>
            <div>
              <span>Teilnehmer</span>
              <strong>{selectedMeeting.participants.length}</strong>
            </div>
          </div>

          <div className="heroActions">
            <button className="primaryButton">Meeting vorbereiten</button>
            <button className="secondaryButton">Meeting starten</button>
          </div>
        </div>

        <div className="agendaCard">
          <span className="eyebrow">Agenda</span>
          <h3>Heute im Fokus</h3>

          <div className="agendaList">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`agendaItem ${
                  selectedMeeting.id === meeting.id ? 'active' : ''
                }`}
              >
                <span>{meeting.time}</span>
                <div>
                  <strong>{meeting.customer}</strong>
                  <p>{meeting.businessGoal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdvisorLens meeting={selectedMeeting} />
    </div>
  )
}