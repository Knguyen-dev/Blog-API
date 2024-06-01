import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";

const minCardWidth = 300;

export default function BlogPostCardSkeleton() {
	return (
		<Card
			sx={{
				minWidth: minCardWidth,
			}}>
			<CardHeader
				avatar={<Skeleton variant="circular" width={40} height={40} />}
				title={<Skeleton variant="text" height={20} width="80%" />}
				subheader={<Skeleton variant="text" height={20} width="50%" />}
			/>
			<Skeleton variant="rectangular" height={175} />
			<CardContent>
				<Skeleton variant="text" height={24} />
				<Skeleton variant="text" height={20} />
				<Skeleton variant="text" height={20} width="80%" />
			</CardContent>
		</Card>
	);
}
