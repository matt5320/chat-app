// import { gc } from "../group-chat.js";
import { schedule } from "../schedule.js";

export async function ScheduleEditor() {
  return {
    data() {
      return {
        name: schedule.value.object.name,
        from: schedule.value.object.from,
        to: schedule.value.object.to,
        selected: Object.values(schedule.value.object.recurrence).every(Boolean)
          ? "daily"
          : "weekly",
        sun: schedule.value.object.recurrence.sun,
        mon: schedule.value.object.recurrence.mon,
        tue: schedule.value.object.recurrence.tue,
        wed: schedule.value.object.recurrence.wed,
        thu: schedule.value.object.recurrence.thu,
        fri: schedule.value.object.recurrence.fri,
        sat: schedule.value.object.recurrence.sat,
      };
    },
    props: ["schedule"],
    template: await fetch("./schedule-editor.html").then((r) => r.text()),
    methods: {
      cancel() {
        for (const key in schedule) {
          delete schedule[key];
        }
      },
      async save() {
        await this.$graffiti.patch(
          {
            value: [
              {
                op: "replace",
                path: "/object/name",
                value: this.name,
              },
              {
                op: "replace",
                path: "/object/from",
                value: this.from,
              },
              {
                op: "replace",
                path: "/object/to",
                value: this.to,
              },
              {
                op: "replace",
                path: "/object/recurrence",
                value: {
                  sun: this.sun,
                  mon: this.mon,
                  tue: this.tue,
                  wed: this.wed,
                  thu: this.thu,
                  fri: this.fri,
                  sat: this.sat,
                },
              },
            ],
          },
          schedule.url,
          this.$graffitiSession.value
        );
        this.cancel();
      },
      async changeName() {
        const name = prompt("New name:");

        if (name === "") return;

        this.name = name;
      },
    },
    computed: {
      getSchedule() {
        return schedule;
      },
    },
  };
}
