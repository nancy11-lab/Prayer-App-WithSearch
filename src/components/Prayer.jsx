import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function Prayer({ name, time, icon }) {
  return (
    <Card
      sx={{
        // maxWidth: "calc(100% - 5px)",
        pt: 2,
      }}
    >
      <Box sx={{ mx: 2 }}>{icon}</Box>

      <CardContent
        sx={{
          // border: "1px solid green",
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "row", sm: "column" },
          justifyContent: { xs: "space-between", sm: "center" },
        }}
      >
        <Typography
          gutterBottom
          variant="h4"
          component="div"
          sx={{ color: "rgb(3,161,110)", fontWeight: "bold",
           }}
        >
          {name}
        </Typography>
        <Typography variant="h3" sx={{ color: "text.secondary" , 
          // border: "1px solid green",
          }}>
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
