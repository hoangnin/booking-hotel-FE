import { useTranslation } from "react-i18next";
import { Button, Group, Menu, Text, Avatar, Flex } from "@mantine/core";

// Flag images
const flagImages = {
  en: "https://flagcdn.com/w40/us.png",
  vi: "https://flagcdn.com/w40/vn.png",
  ja: "https://flagcdn.com/w40/jp.png",
  zh: "https://flagcdn.com/w40/cn.png",
  ko: "https://flagcdn.com/w40/kr.png",
  fr: "https://flagcdn.com/w40/fr.png",
  ru: "https://flagcdn.com/w40/ru.png",
  sa: "https://flagcdn.com/w40/sa.png",
};

// Language names
const languageNames = {
  en: "English",
  vi: "Tiếng Việt",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  fr: "Français",
  ru: "Русский",
  sa: "العربية",
};

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Button variant="subtle" p="xs">
          <Group spacing="xs">
            <Avatar src={flagImages[i18n.language]} size="xs" radius="xl" />
            <Text size="sm" fw={500}>
              {languageNames[i18n.language] || languageNames.en}
            </Text>
            <span style={{ fontSize: "10px" }}>▼</span>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Language / Ngôn ngữ</Menu.Label>

        <Menu.Item
          onClick={() => changeLanguage("en")}
          leftSection={<Avatar src={flagImages.en} size="xs" radius="xl" />}
        >
          English
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("vi")}
          leftSection={<Avatar src={flagImages.vi} size="xs" radius="xl" />}
        >
          Tiếng Việt
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("ja")}
          leftSection={<Avatar src={flagImages.ja} size="xs" radius="xl" />}
        >
          日本語 (Japanese)
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("zh")}
          leftSection={<Avatar src={flagImages.zh} size="xs" radius="xl" />}
        >
          中文 (Chinese)
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("ko")}
          leftSection={<Avatar src={flagImages.ko} size="xs" radius="xl" />}
        >
          한국어 (Korean)
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("fr")}
          leftSection={<Avatar src={flagImages.fr} size="xs" radius="xl" />}
        >
          Français (French)
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("ru")}
          leftSection={<Avatar src={flagImages.ru} size="xs" radius="xl" />}
        >
          Русский (Russian)
        </Menu.Item>

        <Menu.Item
          onClick={() => changeLanguage("sa")}
          leftSection={<Avatar src={flagImages.sa} size="xs" radius="xl" />}
        >
          العربية (Arabic)
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
