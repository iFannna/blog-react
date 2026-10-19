"use client";

import { useState } from "react";
import { ElTimeSelect } from "@/components/ui/time-select";

const row = { display: "flex", gap: "1.2rem", flexWrap: "wrap" as const };

/** 对应官方 time-select/basic。 */
export function TimeSelectBasic() {
  const [value, setValue] = useState<string | null>("");
  return (
    <ElTimeSelect
      value={value}
      onChange={setValue}
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="Select time"
      style={{ width: 240 }}
    />
  );
}

/** 对应官方 time-select/time-formats。 */
export function TimeSelectFormats() {
  const [value, setValue] = useState<string | null>("");
  return (
    <ElTimeSelect
      value={value}
      onChange={setValue}
      start="00:00"
      step="00:30"
      end="23:59"
      placeholder="Select time"
      format="hh:mm A"
      style={{ width: 240 }}
    />
  );
}

/** 对应官方 time-select/time-range：两个选择器互相用 min-time / max-time 约束。 */
export function TimeSelectRange() {
  const [startTime, setStartTime] = useState<string | null>("");
  const [endTime, setEndTime] = useState<string | null>("");

  return (
    <div style={row}>
      <ElTimeSelect
        value={startTime}
        onChange={setStartTime}
        maxTime={endTime}
        placeholder="Start time"
        start="08:30"
        step="00:15"
        end="18:30"
        style={{ width: 240 }}
      />
      <ElTimeSelect
        value={endTime}
        onChange={setEndTime}
        minTime={startTime}
        placeholder="End time"
        start="08:30"
        step="00:15"
        end="18:30"
        style={{ width: 240 }}
      />
    </div>
  );
}
