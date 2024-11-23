import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ThemeSwitcher from "../../app/components/ThemeSwitcher";

const TestPage = () => {
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 2 }}>
        <Box height={600} p={4}>
          <ThemeSwitcher />
          <Typography variant="h1">Heading</Typography>
          <Card>
            <CardHeader title="Card Title" />
            <CardContent>
              <Typography variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                fringilla, nisl nec fermentum tincidunt
              </Typography>
            </CardContent>
          </Card>
          <Divider sx={{ my: 5 }} />
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <Avatar>PG</Avatar>
            <Chip color="info" label="Chip" />
            <Chip color="success" label="Chip" />
            <Chip color="warning" label="Chip" />
            <Chip color="error" label="Chip" />
            <Button>Click me</Button>
            <Button variant="contained">Click me</Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestPage;
