import { Group, Progress, Text } from "@mantine/core";

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  { re: /^.{8,30}$/, label: "8-30 characters long" }, // New requirement
];

function getStrength(password) {
  if (password.length < 5) {
    return 10;
  }

  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

function getStrengthColor(strength) {
  switch (true) {
    case strength < 30:
      return "red";
    case strength < 50:
      return "orange";
    case strength < 70:
      return "yellow";
    default:
      return "teal";
  }
}

function PasswordStrengthChecker({ password }) {
  const strength = getStrength(password);
  const color = getStrengthColor(strength);

  return (
    <div>
      <Group grow gap={5} mt="xs">
        <Progress
          size="xs"
          color={color}
          value={password.length > 0 ? 100 : 0}
          transitionDuration={0}
        />
        <Progress
          size="xs"
          color={color}
          transitionDuration={0}
          value={strength < 30 ? 0 : 100}
        />
        <Progress
          size="xs"
          color={color}
          transitionDuration={0}
          value={strength < 50 ? 0 : 100}
        />
        <Progress
          size="xs"
          color={color}
          transitionDuration={0}
          value={strength < 70 ? 0 : 100}
        />
      </Group>
      <div style={{ marginTop: "10px" }}>
        {requirements.map((requirement, index) => (
          <Text
            key={index}
            size="xs"
            color={requirement.re.test(password) ? "green" : "red"}
          >
            {requirement.label}
          </Text>
        ))}
      </div>
    </div>
  );
}

export default PasswordStrengthChecker;
