
import { House, Search, User, Wrench } from "lucide-react";

const howWeWork = [
  {
    icon: Search,
    title: "Discover Properties",
    description:
      "Browse property listings, compare options, and find a home that fits your budget and needs.",
  },
  {
    icon: User,
    title: "Connect with Verified Renters",
    description:
      "Help landlords and agents connect with verified renters, review tenant information, and find suitable tenants with greater confidence and ease.",
  },
  {
    icon: House,
    title: "Rent or Buy Securely",
    description:
      "Manage your rental transactions securely and use RentKeepa to save towards rent through a structured savings plan.",
  },
  {
    icon: Wrench,
    title: "Manage & Maintain",
    description:
      "Handle property management, report maintenance issues, and connect with artisans to keep properties in good condition.",
  },
];

export default function HowWeWork() {
  return (
    <section
      className="w-full flex items-center justify-center py-10 px-2 bg-white"
      id="how-it-works"
    >
      <div className="w-full max-w-7xl flex flex-col items-center gap-16">
        <div className="w-full flex flex-col gap-1 items-center justify-center">
          <h4 className="text-xs uppercase text-primary">
            In just 3 steps, see how
          </h4>
          <h2 className="text-2xl capitalize font-semibold text-slate-700">
            How RentCreeb Works
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 gap-8 md:gap-0 md:grid-cols-4">
          {howWeWork.map((howWork, index) => {
            const Icon = howWork.icon;

            return (
              <div
                key={howWork.title}
                className="w-full flex flex-col gap-4"
              >
                <div className="w-full flex items-center gap-1 justify-center">
                  <span
                    className={`h-[2px] flex-grow bg-muted hidden md:flex ${
                      index === 0 ? "md:invisible" : ""
                    }`}
                  />

                  <span className="size-16 shrink-0 bg-primary rounded-full flex items-center justify-center relative">
                    <Icon className="text-white size-6" />

                    <span className="absolute border-2 border-white -top-1 -right-2 text-[10px] text-white bg-slate-900 rounded-full size-6 flex items-center justify-center">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>

                  <span
                    className={`h-[2px] flex-grow bg-muted hidden md:flex ${
                      index === howWeWork.length - 1
                        ? "md:invisible"
                        : ""
                    }`}
                  />
                </div>

                <div className="w-full flex flex-col items-center gap-3 max-w-[80%] mx-auto">
                  <h3 className="font-semibold text-sm capitalize text-center text-slate-700">
                    {howWork.title}
                  </h3>

                  <p className="text-xs text-slate-600 text-center">
                    {howWork.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
