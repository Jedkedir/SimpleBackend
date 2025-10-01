const body = document.querySelector("body");
const main = document.querySelector("main");
const sold_amount = document.querySelector(".sold_amount");
const bar_graph = document.querySelector(".bar_grapgh");
const revenue = document.querySelector(".revenue_amount");
const notif = document.querySelector(".notification");
const recent = document.querySelector(".recent_action");

function dashboard(info, data, notification, recent_actions_list) {
  sold_amount.textContent = info.sold;
  revenue.textContent = info.revenue + "$";

  const bars_graph = document.querySelector(".bar_graph");
  let ctx = document.createElement("canvas");
  ctx.width = "100%";
  ctx.classList.add("gragh");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((row) => row.name),
      datasets: [
        {
          label: "Sold Products",
          data: data.map((row) => row.sold),
        },
      ],
    },
  });
  bars_graph.appendChild(ctx);

  notification_add(notification);
  recent_actions_add(recent_actions_list);
}

info = {
  sold: 150,
  revenue: 2000,
};

//default value for sold amount
sold_amount.textContent = 0;

const data = [
  { name: "savage shirt", sold: 9 },
  { name: "disavage shorts", sold: 10 },
  { name: "flying hat", sold: 7 },
  { name: "swimming shoes", sold: 11 },
  { name: "back hide", sold: 4 },
  { name: "savage shirt", sold: 9 },
  { name: "disavage shorts", sold: 10 },
  { name: "flying hat", sold: 7 },
  { name: "swimming shoes", sold: 11 },
  { name: "back hide", sold: 4 },
  { name: "back hide", sold: 4 },
];
data.sort((a, b) => b.sold - a.sold);

let n = [
  { text: "new notification 1" },
  { text: "new notification 2" },
  { text: "new notification 3" },
  { text: "new notification 4" },
  { text: "new notification 5" },
  { text: "new notification 6" },
];

let r = [
  { text: "recent action 1", date: new Date() },
  { text: "recent action 2", date: new Date() },
  { text: "recent action 3", date: new Date() },
  { text: "recent action 4", date: new Date() },
  { text: "recent action 5", date: new Date() },
  { text: "recent action 1", date: new Date() },
  { text: "recent action 2", date: new Date() },
  { text: "recent action 3", date: new Date() },
  { text: "recent action 4", date: new Date() },
  { text: "recent action 5", date: new Date() },
  { text: "recent action 1", date: new Date() },
  { text: "recent action 2", date: new Date() },
  { text: "recent action 3", date: new Date() },
  { text: "recent action 4", date: new Date() },
  { text: "recent action 5", date: new Date() },
];

dashboard(info, data, n, r);

function notification_add(notification) {
  if (notification.length == 0) {
    notif.appendChild(empty_list("No new notifications"));

    return;
  }

  notification.forEach((n) => {
    let notification_tile = document.createElement("div");
    let detail = document.createElement("p");

    notification_tile.classList.add("notification_item");
    detail.textContent = n.text;
    notification_tile.appendChild(detail);

    notif.appendChild(notification_tile);
  });
}

function empty_list(string) {
  let p = document.createElement("p");
  p.textContent = string;
  p.style = "text-align:center; font-size: 2em;";

  return p;
}

function recent_actions_add(actions) {
  if (actions.length == 0) {
    recent.appendChild(empty_list("No recent action"));
    return;
  }
  actions.forEach((action) => {
    let r_action = document.createElement("div");
    let detail = document.createElement("p");
    let time = document.createElement("p");
    r_action.classList.add("actions");
    detail.textContent = action.text;
    time.textContent = action.date;
    r_action.appendChild(detail);
    r_action.appendChild(time);
    recent.appendChild(r_action);
  });
}
