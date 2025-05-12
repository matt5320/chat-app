import { convo } from "./conversation.js";

export async function Messenger() {
  return {
    data() {
      return {
        sending: false,
        message: "",
      };
    },
    template: await fetch("./messenger.html").then((r) => r.text()),
    methods: {
      self(object, session) {
        return object.actor === session.value.actor ? " self" : "";
      },
      async sendMessage(session) {
        if (!this.message) return;

        this.sending = true;

        await this.$graffiti.put(
          {
            value: {
              content: this.message,
              published: Date.now(),
              conversation: convo.url,
            },
            channels: [...convo.otherActors, this.$graffitiSession.value.actor],
          },
          session
        );

        this.sending = false;
        this.message = "";

        // Refocus the input field after sending the message
        await this.$nextTick();
        this.$refs.messageInput.focus();
        document.querySelector(".messages-container").scroll(0, 0);
      },
      getProfileNames(profiles) {
        if (!convo.otherActors) return [];
        return convo.otherActors.map((actor) => {
          for (const profile of profiles) {
            if (profile.value.describes === actor) return profile.value.name;
          }
          return actor;
        });
      },
      isCurrentTimeBetween(startTime, endTime) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        return (
          currentMinutes >= startTotalMinutes &&
          currentMinutes <= endTotalMinutes
        );
      },
      isBusyToday(recurrence) {
        const dayOfWeek = new Date().getDay();
        const week = [
          recurrence.sun,
          recurrence.mon,
          recurrence.tue,
          recurrence.wed,
          recurrence.thu,
          recurrence.fri,
          recurrence.sat,
        ];
        return week[dayOfWeek];
      },
      isBusy(schedules) {
        for (const schedule of schedules) {
          if (
            this.isBusyToday(schedule.value.object.recurrence) &&
            this.isCurrentTimeBetween(
              schedule.value.object.from,
              schedule.value.object.to
            )
          )
            return true;
        }
        return false;
      },
    },
    computed: {
      getConvo() {
        return convo;
      },
    },
  };
}
