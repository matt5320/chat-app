import { defineAsyncComponent } from "vue";
import { Schedule } from "./schedule.js";

export async function Profile() {
  return {
    components: {
      Schedule: defineAsyncComponent(Schedule),
    },
    data() {
      return {
        friends: [],
        editing: false,
        name: "",
        pronouns: "",
        bio: "",
      };
    },
    methods: {
      cancel(profile) {
        this.name = profile.name;
        this.pronouns = profile.pronouns;
        this.bio = profile.bio;
      },
      async update(url) {
        await this.$graffiti.patch(
          {
            value: [
              {
                op: "replace",
                path: "/name",
                value: this.name,
              },
              {
                op: "replace",
                path: "/pronouns",
                value: this.pronouns,
              },
              {
                op: "replace",
                path: "/bio",
                value: this.bio,
              },
            ],
          },
          url,
          this.$graffitiSession.value
        );
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
            return schedule;
        }
        return false;
      },
      getScheduleTimes(obj) {
        if (!obj?.recurrence) return null;
        if (
          !obj.recurrence.sun &&
          !obj.recurrence.mon &&
          !obj.recurrence.tue &&
          !obj.recurrence.wed &&
          !obj.recurrence.thu &&
          !obj.recurrence.fri &&
          !obj.recurrence.sat
        )
          return null;
        const days = [
          obj.recurrence.sun ? "Sunday" : null,
          obj.recurrence.mon ? "Monday" : null,
          obj.recurrence.tue ? "Tuesday" : null,
          obj.recurrence.wed ? "Wednesday" : null,
          obj.recurrence.thu ? "Thursday" : null,
          obj.recurrence.fri ? "Friday" : null,
          obj.recurrence.sat ? "Saturday" : null,
        ].filter((day) => day);
        return `${obj.name} from ${obj.from} to ${obj.to} on ${days.join(
          ", "
        )}`;
      },
      async updateInfo() {
        const profileIterator = this.$graffiti.discover(
          ["designftw-2025-studio2", "designftw"],
          {
            properties: {
              value: {
                required: ["generator", "describes", "name", "pronouns", "bio"],
                properties: {
                  generator: { type: "string" },
                  describes: {
                    type: "string",
                    const: this.$graffitiSession.value.actor,
                  },
                  name: { type: "string" },
                  pronouns: { type: "string" },
                  bio: { type: "string" },
                },
              },
            },
          }
        );

        for await (const profile of profileIterator) {
          this.name = profile.object.value.name;
          this.pronouns = profile.object.value.pronouns;
          this.bio = profile.object.value.bio;
        }
      },
    },
    template: await fetch("./profile.html").then((r) => r.text()),
    mounted() {
      if (!this.$graffitiSession.value) {
        this.$router.push("/");
      }
      this.updateInfo();
    },
  };
}
