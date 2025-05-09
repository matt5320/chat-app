import { defineAsyncComponent } from "vue";
import { Schedule } from "./schedule.js";
import { ScheduleEditor } from "./schedule-editor.js";
import { schedule } from "./selected-schedule.js";

export async function Schedules() {
  return {
    components: {
      Schedule: defineAsyncComponent(Schedule),
      ScheduleEditor: defineAsyncComponent(ScheduleEditor),
    },
    methods: {
      async createSchedule() {
        await this.$graffiti.put(
          {
            value: {
              activity: "Schedule",
              object: {
                name: "New Schedule",
                activated: true,
                from: "",
                to: "",
                recurrence: {
                  sun: false,
                  mon: false,
                  tue: false,
                  wed: false,
                  thu: false,
                  fri: false,
                  sat: false,
                },
              },
            },
            channels: [this.$graffitiSession.value.actor],
          },
          this.$graffitiSession.value
        );
      },
      selectSchedule(newSchedule) {
        if (schedule.url === newSchedule.url) return;

        for (const key in schedule) {
          delete schedule[key];
        }
        new Promise((resolve) => setTimeout(resolve, 100)).then(() => {
          Object.assign(schedule, newSchedule);
        });
      },
    },
    computed: {
      getSchedule() {
        return schedule;
      },
    },
    template: await fetch("./schedules.html").then((r) => r.text()),
    mounted() {
      if (!this.$graffitiSession.value) {
        this.$router.push("/");
      }
    },
  };
}
