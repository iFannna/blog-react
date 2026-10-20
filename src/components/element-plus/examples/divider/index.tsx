"use client";

import { ElDivider } from "@/components/element-plus/divider";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { StarFilled } from "@/components/element-plus/icons";

export function DividerBasic() {
  return (
    <div>
      <span>
        I sit at my window this morning where the world like a passer-by stops
        for a moment, nods to me and goes.
      </span>
      <ElDivider />
      <span>
        There little thoughts are the rustle of leaves; they have their whisper
        of joy in my mind.
      </span>
    </div>
  );
}

export function DividerText() {
  return (
    <div>
      <span>What you are you do not see, what you see is your shadow. </span>
      <ElDivider contentPosition="left">Rabindranath Tagore</ElDivider>
      <span>
        My wishes are fools, they shout across thy song, my Master. Let me but
        listen.
      </span>
      <ElDivider>
        <ElIcon>
          <StarFilled />
        </ElIcon>
      </ElDivider>
      <span>I cannot choose the best. The best chooses me.</span>
      <ElDivider contentPosition="right">Rabindranath Tagore</ElDivider>
    </div>
  );
}

export function DividerVertical() {
  return (
    <div>
      <span>Rain</span>
      <ElDivider direction="vertical" />
      <span>Home</span>
      <ElDivider direction="vertical" borderStyle="dashed" />
      <span>Grass</span>
    </div>
  );
}

export function DividerBorderStyle() {
  return (
    <>
      <div>
        <span>What language is thine, O sea?</span>
        <ElDivider borderStyle="dashed" />
        <span>The language of eternal question.</span>
      </div>
      <ElDivider borderStyle="dotted" />
      <span>What language is thy answer, O sky?</span>
      <ElDivider borderStyle="double" />
      <span>The language of eternal silence.</span>
    </>
  );
}
